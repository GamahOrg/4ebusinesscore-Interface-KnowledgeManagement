export interface blog {
    countOFBlog: number;
    countOfComments: number;
    blogLiksAvage: number;
    blogs: Array<{
        blogId: string;
        countOfBlogLiks: number;
        countOfBlogComments: number;
        }>; 
}

export interface AskExpert {
    countOFExpert: number;
    countOFQuestions: number;
    countOfComments: number;
    averageResponseTime: string;
    expertResponseAvarge: number;
    experts: Array<{
        expertId: string;
        countOFSpecializations: number;
        countOFExpertQuestions: number;
        }>;
}

export interface Challenges {
    countOFChallenges: number;
    countUsersReacted: number;
    countOfComments: number;
    interactionsOnChallenges: number;
    chaleges: Array<{
        chalegeId: string;
        countOfChallengeComments: number;
        }>;
}

export interface IdeaBank {
    countOFIdeaBanks: number;
    countIfInteractionsOnBlogs: number;
    countOfLisks: number;
    countOfViews: number;
}

export interface Knowledge {
    countOFPublicKnowledges: number;
    countOFPrivateKnowledges: number;
    countOFSubKnowledges: number;
    rateKnowledgeFavoirates: number;
    countOfAttachments: number;
    subKnowledges: Array<{
        subKnowledgeId: string;
        countOfViews: number;
        countOfRates: number;
        }>;
}

export interface UserAndIOrgIndicators {
    countOfInteractiveUsers: number;
    subKnowledges: Array<{
        subKnowledgeId: string;
        countOfOrgs: number;
        countOfUsers: number;
        }>;
    knowledges: Array<{
        knowlegeId: string;
        type: number;
        countOfOrgs: number;
        }>;
    orgs: Array<{
        orgId: string;
        countOfSubKnowledges: number;
        }>;
    users: Array<{
        userId: string;
        countOfContributions: number;
        }>;
}